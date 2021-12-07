#!/usr/bin/python
# Librerías
import sys  #Para leer entradas de terminal
import json
from sklearn.preprocessing import MinMaxScaler #Para normalizar los datos
import numpy as np
from keras.models import model_from_json

# ## Parámetros de entrada
tipo_senal = 'ojos'
nombres = sys.argv    #Lista de datos que entran por consola al ejecutar el programa
#nombres = [comando de ejecución, nombre del archivo de datos, nombre del output]
nom_datos = nombres[1]  #Nombre del archivo de datos
nom_output = nombres[2] #Nombre del archivo de output
nom_red = "clasifica_" + tipo_senal

carpeta_modelos = './models/ojos/' #Carpeta o subcarpeta donde están los modelos
#################################
# # --------- Implementación
#################################
# ## --------- Recopilación de datos y parámetros
# ### Obtener modelo entrenado

# Carga json y crea modelo
json_archivo = open(carpeta_modelos + nom_red + '.json', 'r')
clasifica_json = json_archivo.read()
json_archivo.close()
clasifica = model_from_json(clasifica_json)

# Carga los pesos al modelo
clasifica.load_weights(carpeta_modelos + nom_red + ".h5")
clasifica.compile(optimizer='rmsprop', loss='binary_crossentropy', metrics=['accuracy'])
print("Modelo clasifica cargado")
 


# Carga json y crea modelo verdad
nom_red2 = "modelo_v_" + tipo_senal
json_archivo = open(carpeta_modelos + nom_red2 + '.json', 'r')
modelo_v_json = json_archivo.read()
json_archivo.close()
modelo_v = model_from_json(modelo_v_json)

# Carga los pesos al modelo
modelo_v.load_weights(carpeta_modelos + nom_red2 + ".h5")
modelo_v.compile(optimizer='rmsprop', loss='mse', metrics=['accuracy'])
print("Modelo verdad cargado")
 

# Carga json y crea modelo mentira
nom_red3 = "modelo_m_" + tipo_senal
json_archivo = open(carpeta_modelos + nom_red3 + '.json', 'r')
modelo_m_json = json_archivo.read()
json_archivo.close()
modelo_m = model_from_json(modelo_m_json)

# Carga los pesos al modelo
modelo_m.load_weights(carpeta_modelos + nom_red3 + ".h5")
modelo_m.compile(optimizer='rmsprop', loss='mse', metrics=['accuracy'])
print("Modelo mentira cargado")


# ### ----------------- Señal a clasificar
datos = open(nom_datos, "r").read() #Abre el archivo de datos (tipo .txt)
datos = np.array(json.loads(datos)).astype(float)   #Separa el texto, convierte la lista en arreglo y a datos numéricos   #Separa el texto, convierte la lista en arreglo y a datos numéricos
datos = np.concatenate((np.zeros(60-1), datos))

# ### Predicción de modelos

# Preprocesamiento de datos
datos_mod = datos

tamano = datos_mod.size
sc = MinMaxScaler()
datos_mod = sc.fit_transform(datos_mod.reshape(tamano,1))   #Normalizado de los datos_mod

dim_salida = 1  #Dimensión final de la LSTM (salida)
entradas = []    #Lista de entradas
for i in range(60, tamano):
    entradas.append(datos_mod[i-60:i, 0])
    
entradas = np.array(entradas) #Convierte a arreglo
dim_entrada = len(entradas)
entradas = entradas.reshape(dim_entrada, 60, dim_salida) #Ajusta las dimensiones para entrar a la red LSTM

# Recopilación de datos

mod_v = modelo_v.predict(entradas) #Predice usando la Red seno
mod_v = sc.inverse_transform(mod_v).reshape(-1)

mod_m = modelo_m.predict(entradas) #Predice usando la Red cuadrado
mod_m = sc.inverse_transform(mod_m).reshape(-1)

datos = datos[59:-1]

if (datos.size<=5):
        datos = np.concatenate((datos, np.zeros(5-datos.size+5)))
        mod_v = np.concatenate((mod_v, np.zeros(5-mod_v.size+5)))        
        mod_m = np.concatenate((mod_m, np.zeros(5-mod_m.size+5)))

datos_entrada =  np.array([datos, mod_v, mod_m]).T #Abre el archivo de datos (tipo .txt)

###############################
# ## Preprocesamiento de datos de entrada a la red (señal, modv y modm)
tamano = datos_entrada.shape
sc = MinMaxScaler()
datos_entrada = sc.fit_transform(datos_entrada.reshape(tamano[0],tamano[1]))   #Normalizado de los datos_entrada

#Particiones en los datos para entrenar
paso_tiempo = 5  #Tamaño de la partición (segunda dimensión LSTM)
num_carac = 3  #Número de características
entradas = []    #Lista de entradas

for i in range(paso_tiempo, tamano[0]):
    entradas.append(datos_entrada[i-paso_tiempo:i, :])

entradas = np.array(entradas) #Convierte a arreglo

dim_entrada = len(entradas)
entradas = entradas.reshape(dim_entrada, paso_tiempo, num_carac) #Ajusta las dimensiones para entrar a la red LSTM"""

# ## Clasificación por segmento
clasificacion = clasifica.predict(entradas) #Predice usando la Red
clasificacion = np.mean(clasificacion)
print(clasificacion)
np.savetxt(nom_output, [clasificacion]) #Guarda archivo