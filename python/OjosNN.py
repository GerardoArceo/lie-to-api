# Librerías
import sys  #Para leer entradas de terminal
from sklearn.preprocessing import MinMaxScaler #Para normalizar los datos

from keras.models import Sequential
from keras.layers import Dense, LSTM, Dropout

from scipy.io.wavfile import write
import matplotlib.pyplot as plt
import pandas as pd
from pandas_datareader import data
import datetime as dt
import urllib.request, json
import os
import numpy as np
# %% [markdown]
# ## Recopilación de datos

# %%
# Recopilación de datos
nombres = sys.argv    #Lista de datos que entran por consola al ejecutar el programa
#nombres = [comando de ejecución, nombre del archivo de datos, nombre del output]
nom_datos = nombres[1]  #Nombre del archivo de datos
nom_output = nombres[2] #Nombre del archivo de output

"""# Para ejecutar archivo .py, borrar del cuaderno de Jupyter
datos = open(nom_datos, "r").read() #Abre el archivo de datos (tipo .txt)
datos = np.array(datos.split("\n")).astype(float)   #Separa el texto, convierte la lista en arreglo y a datos numéricos"""

# Para ejecutar el cuaderno de Jupyter, borrar del archivo .py
datos = open("data_ojos.txt", "r").read() #Abre el archivo de datos (tipo .txt)
datos = np.array(datos.split("\n")).astype(float)   #Separa el texto, convierte la lista en arreglo y a datos numéricos"""

# %% [markdown]
# ## Preprocesamiento de datos

# %%
# Preprocesamiento de datos
tamano = datos.size
datos = MinMaxScaler().fit_transform(datos.reshape(tamano,1))   #Normalizado de los datos

#Particiones en los datos para entrenar
paso_tiempo = 60  #Tamaño de la partición (segunda dimensión LSTM)
dim_salida = 1  #Dimensión final de la LSTM (salida)
entradas = []    #Lista de entradas
etiquetas = []  #Lista de etiquetas
for i in range(60, tamano):
    entradas.append(datos[i-60:i, 0])
    etiquetas.append(datos[i, 0])
entradas, etiquetas = np.array(entradas), np.array(etiquetas) #Convierte a arreglos

dim_entrada = len(entradas)
entradas = entradas.reshape(dim_entrada, paso_tiempo, dim_salida) #Ajusta las dimensiones para entrar a la red LSTM

# %% [markdown]
# ## Definición de la estructura de la red LSTM

# %%
# Definición de la estructura de la red LSTM
n_neuronas = 50 #Número de neuronas
capas = 2   #Capas internas del modelo
abandono = 0.2  #Fracción de datos seleccionados para abandono
modelo = Sequential()   #Modelo de aprendizaje

modelo.add(LSTM(units=n_neuronas, return_sequences=True, input_shape=(paso_tiempo, dim_salida)))   #Capa inicial LSTM
modelo.add(Dropout(abandono))    #Capa de abandono

for _ in range (capas):
    modelo.add(LSTM(units=n_neuronas, return_sequences=True))
    modelo.add(Dropout(abandono))

modelo.add(LSTM(units=n_neuronas))  #Capa final LSTM
modelo.add(Dropout(abandono))

modelo.add(Dense(units = dim_salida))   #Capa densa (salida de la red)

modelo.compile(optimizer='rmsprop', loss='mse') #Compilación del modelo

# %% [markdown]
# ## Entrenamiento de la red LSTM

# %%
# Entrenamiento de la red LSTM
iteraciones = 20   #Iteraciones del proceso de entrenamiento
tam_lote = 32   #Tamaño de lotes de datos a mostrar a la red
modelo.fit(entradas, etiquetas, epochs = iteraciones, batch_size = tam_lote)

# %% [markdown]
# # Ejemplo pasado, uso informativo (eliminar al terminar)

# %%
df = df.sort_values('Date')
tiempo = np.array(range(datos.size))
datos[0]=10
# Double check the result
df.head()


plt.figure(figsize = (18,9))
plt.plot(range(df.shape[0]),(df['Low']+df['High'])/2.0)
plt.xticks(range(0,df.shape[0],500),df['Date'].loc[::500],rotation=45)
plt.xlabel('Fecha',fontsize=18)
plt.ylabel('Precio medio',fontsize=18)
plt.show()



# First calculate the mid prices from the highest and lowest
high_prices = df.loc[:,'High'].to_numpy()
low_prices = df.loc[:,'Low'].to_numpy()
mid_prices = (high_prices+low_prices)/2.0

train_data = mid_prices[:11000]
test_data = mid_prices[11000:]

# %%
# Scale the data to be between 0 and 1
# When scaling remember! You normalize both test and train data with respect to training data
# Because you are not supposed to have access to test data
scaler = MinMaxScaler()
train_data = train_data.reshape(-1,1)
test_data = test_data.reshape(-1,1)

# Train the Scaler with training data and smooth data
smoothing_window_size = 2500
for di in range(0,10000,smoothing_window_size):
    scaler.fit(train_data[di:di+smoothing_window_size,:])
    train_data[di:di+smoothing_window_size,:] = scaler.transform(train_data[di:di+smoothing_window_size,:])

# You normalize the last bit of remaining data
scaler.fit(train_data[di+smoothing_window_size:,:])
train_data[di+smoothing_window_size:,:] = scaler.transform(train_data[di+smoothing_window_size:,:])

# Reshape both train and test data
train_data = train_data.reshape(-1)

# Normalize test data
test_data = scaler.transform(test_data).reshape(-1)

# Now perform exponential moving average smoothing
# So the data will have a smoother curve than the original ragged data
EMA = 0.0
gamma = 0.1
for ti in range(11000):
  EMA = gamma*train_data[ti] + (1-gamma)*EMA
  train_data[ti] = EMA

# Used for visualization and test purposes
all_mid_data = np.concatenate([train_data,test_data],axis=0)

# %%
window_size = 100
N = train_data.size
std_avg_predictions = []
std_avg_x = []
mse_errors = []

for pred_idx in range(window_size,N):

    if pred_idx >= N:
        date = dt.datetime.strptime(k, '%Y-%m-%d').date() + dt.timedelta(days=1)
    else:
        date = df.loc[pred_idx,'Date']

    std_avg_predictions.append(np.mean(train_data[pred_idx-window_size:pred_idx]))
    mse_errors.append((std_avg_predictions[-1]-train_data[pred_idx])**2)
    std_avg_x.append(date)

print('MSE error for standard averaging: %.5f'%(0.5*np.mean(mse_errors)))

plt.figure(figsize = (18,9))
plt.plot(range(df.shape[0]),all_mid_data,color='b',label='Original')
plt.plot(range(window_size,N),std_avg_predictions,color='orange',label='Predicción')
#plt.xticks(range(0,df.shape[0],50),df['Date'].loc[::50],rotation=45)
plt.xlabel('Fecha')
plt.ylabel('Precio medio')
plt.legend(fontsize=18)
plt.show()

# %%
window_size = 100
N = train_data.size

run_avg_predictions = []
run_avg_x = []

mse_errors = []

running_mean = 0.0
run_avg_predictions.append(running_mean)

decay = 0.5

for pred_idx in range(1,N):

    running_mean = running_mean*decay + (1.0-decay)*train_data[pred_idx-1]
    run_avg_predictions.append(running_mean)
    mse_errors.append((run_avg_predictions[-1]-train_data[pred_idx])**2)
    run_avg_x.append(date)

print('MSE error for EMA averaging: %.5f'%(0.5*np.mean(mse_errors)))




plt.figure(figsize = (18,9))
plt.plot(range(df.shape[0]),all_mid_data,color='b',label='Original')
plt.plot(range(0,N),run_avg_predictions,color='orange', label='Predicción')
#plt.xticks(range(0,df.shape[0],50),df['Date'].loc[::50],rotation=45)
plt.xlabel('Fecha')
plt.ylabel('Precio medio')
plt.legend(fontsize=18)
plt.show()

write('hola.wav',44100,np.array(run_avg_predictions))  #genera el archivo del sonido

# %%


# %%



