# Librerías
import sys  #Para leer entradas de terminal
from sklearn.preprocessing import MinMaxScaler #Para normalizar los datos

from keras.models import Sequential
from keras.layers import Dense, LSTM, Dropout

from scipy.io.wavfile import write
# import matplotlib.pyplot as plt
import pandas as pd
from pandas_datareader import data
import datetime as dt
import urllib.request, json
import os
import numpy as np
import json

# %% [markdown]
# ## Recopilación de datos

# %%
# Recopilación de datos
nombres = sys.argv    #Lista de datos que entran por consola al ejecutar el programa
#nombres = [comando de ejecución, nombre del archivo de datos, nombre del output]
nom_datos = nombres[1]  #Nombre del archivo de datos
nom_output = nombres[2] #Nombre del archivo de output

# Para ejecutar archivo .py, borrar del cuaderno de Jupyter
datos = open(nom_datos, "r").read() #Abre el archivo de datos (tipo .txt)
datos = np.array(datos.split("\n")).astype(float)   #Separa el texto, convierte la lista en arreglo y a datos numéricos"""

"""
# Para ejecutar el cuaderno de Jupyter, borrar del archivo .py
datos = open(nom_datos, "r").read() #Abre el archivo de datos (tipo .txt)
datos = np.array(datos.split("\n")).astype(float)   #Separa el texto, convierte la lista en arreglo y a datos numéricos"""

# %% [markdown]
# ## Preprocesamiento de datos

# %%
# Preprocesamiento de datos
tamano = datos.size
datos = MinMaxScaler().fit_transform(datos.reshape(tamano,1))   #Normalizado de los datos

#Particiones en los datos para entrenar
paso_tiempo = 10  #Tamaño de la partición (segunda dimensión LSTM)
dim_salida = 1  #Dimensión final de la LSTM (salida)
entradas = []    #Lista de entradas
etiquetas = []  #Lista de etiquetas
for i in range(paso_tiempo, tamano):
    entradas.append(datos[i-paso_tiempo:i, 0])
    etiquetas.append(datos[i, 0])
entradas, etiquetas = np.array(entradas), np.array(etiquetas) #Convierte a arreglos

dim_entrada = len(entradas)
entradas = entradas.reshape(dim_entrada, paso_tiempo, dim_salida) #Ajusta las dimensiones para entrar a la red LSTM

# %% [markdown]
# ## Definición de la estructura de la red LSTM

# %%
# Definición de la estructura de la red LSTM
n_neuronas = 50 #Número de neuronas
capas = 0   #Capas internas del modelo
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
iteraciones = 1   #Iteraciones del proceso de entrenamiento
tam_lote = 32   #Tamaño de lotes de datos a mostrar a la red
modelo.fit(entradas, etiquetas, epochs = iteraciones, batch_size = tam_lote)

# %% [markdown]
# # Ejemplo pasado, uso informativo (eliminar al terminar)


# plt.figure(figsize = (18,9))
# plt.plot(range(df.shape[0]),all_mid_data,color='b',label='Original')
# plt.plot(range(0,N),run_avg_predictions,color='orange', label='Predicción')
# #plt.xticks(range(0,df.shape[0],50),df['Date'].loc[::50],rotation=45)
# plt.xlabel('Fecha')
# plt.ylabel('Precio medio')
# plt.legend(fontsize=18)
# plt.show()




data = {
    'result': True,
    'hit_probability': 100
}

with open(nom_output, 'w') as outfile:
    json.dump(data, outfile)

# np.savetxt(nom_output,'{""}')  #genera el archivo del sonido

# %%


# %%

