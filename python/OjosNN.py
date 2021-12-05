#!/usr/bin/python

# Librerías
import sys  #Para leer entradas de terminal
from sklearn.preprocessing import MinMaxScaler #Para normalizar los datos
import numpy as np
from keras.models import model_from_json
from keras.layers import LSTM
import json

# Obtención de datos y parámetros
nombres = sys.argv    #Lista de datos que entran por consola al ejecutar el programa
#nombres = [comando de ejecución, nombre del archivo de datos, nombre del output]
nom_datos = nombres[1]  #Nombre del archivo de datos
nom_output = nombres[2] #Nombre del archivo de output

datos = open(nom_datos, "r").read() #Abre el archivo de datos (tipo .txt)
datos = np.array(json.loads(datos)).astype(float)   #Separa el texto, convierte la lista en arreglo y a datos numéricos

# Obtener modelo entrenado
# Carga json y crea modelo
json_archivo = open('modelo.json', 'r')
red_modelo_json = json_archivo.read()
json_archivo.close()
red_modelo = model_from_json(red_modelo_json)

# Carga los pesos al modelo
red_modelo.load_weights("modelo.h5")
print("Modelo cargado")
 
# Compila el modelo
red_modelo.compile(optimizer='rmsprop', loss='mse', metrics=['accuracy'])


# Prueba con datos
# Preprocesamiento de datos
tamano = datos.size
datos = MinMaxScaler().fit_transform(datos.reshape(tamano,1))   #Normalizado de los datos

#Particiones en los datos para entrenar
paso_tiempo = 60  #Tamaño de la partición (segunda dimensión LSTM)
dim_salida = 1  #Dimensión final de la LSTM (salida)
entradas = []    #Lista de entradas
for i in range(paso_tiempo, tamano):
    entradas.append(datos[i-paso_tiempo:i, 0])
    
entradas = np.array(entradas) #Convierte a arreglo
dim_entrada = len(entradas)
entradas = entradas.reshape(dim_entrada, paso_tiempo, dim_salida) #Ajusta las dimensiones para entrar a la red LSTM

# ## Predicciones
predicciones = red_modelo.predict(entradas) #Predice usando la Red

data = {
    'result': True,
    'hit_probability': 100,
    # 'predicciones': predicciones
}

with open(nom_output, 'w') as outfile:
    json.dump(data, outfile)

    print('Procesamiento finalizado')


# np.savetxt(nom_output,'{""}')  #genera el archivo del sonido

# %%


# %%

