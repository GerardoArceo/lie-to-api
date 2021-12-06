#!/usr/bin/python
# Librerías
import sys  #Para leer entradas de terminal
from sklearn.preprocessing import MinMaxScaler #Para normalizar los datos
import numpy as np
from keras.models import model_from_json

# ## Parámetros de entrada
nombres = sys.argv    #Lista de datos que entran por consola al ejecutar el programa
#nombres = [comando de ejecución, nombre del archivo de datos, nombre del output]
nom_datos_ojos = nombres[1]  #Nombre del archivo de datos
nom_datos_bpm = nombres[2]  #Nombre del archivo de datos
nom_datos_voz = nombres[3]  #Nombre del archivo de datos
nom_output = nombres[4] #Nombre del archivo de output
nom_red = "prediccion"

carpeta_modelos = './models/final/' #Carpeta o subcarpeta donde están los modelos
#################################
# # --------- Implementación
#################################
# ## --------- Recopilación de datos y parámetros

# ### Obtener modelo entrenado
# Carga json y crea modelo
json_archivo = open(carpeta_modelos + nom_red + '.json', 'r')
red_modelo_json = json_archivo.read()
json_archivo.close()
red_modelo = model_from_json(red_modelo_json)

# Carga los pesos al modelo
red_modelo.load_weights(carpeta_modelos + nom_red + ".h5")
print("Modelo cargado")


# ###  ------------- Clasificaciones a ponderar
lst_ojos = (nom_datos_ojos)    #Lista de nombres de archivos de datos de ojos
lst_bpm = (nom_datos_bpm)    #Lista de nombres de archivos de datos de bpm
lst_voz = (nom_datos_voz)    #Lista de nombres de archivos de datos de voz

clasi_ojos = np.mean(np.loadtxt(lst_ojos)) #Obtiene clasificación de ojos
clasi_bpm = np.mean(np.loadtxt(lst_bpm)) #Obtiene clasificación de bpm
clasi_voz = np.mean(np.loadtxt(lst_voz)) #Obtiene clasificación de voz

entradas =  np.array([clasi_ojos, clasi_bpm, clasi_voz]).T #Crea el arreglo de características

# Preprocesamiento de datos
tamano = entradas.size
sc = MinMaxScaler()
entradas = sc.fit_transform(entradas.reshape(tamano,1))

paso_tiempo = 1  #Tamaño de la partición (segunda dimensión LSTM)
num_carac = 3  #Número de características
dim_entrada = 1

entradas = entradas.reshape(dim_entrada, paso_tiempo, num_carac) #Ajusta las dimensiones para entrar a la red LSTM"""

# ## Clasificación final
# Predicciones
predicciones = red_modelo.predict(entradas) #Predice usando la Red
np.savetxt(nom_output, predicciones) #Guarda archivo en la carpeta de datos
print(clasi_ojos)
print(clasi_bpm)
print(clasi_voz)
print(predicciones)