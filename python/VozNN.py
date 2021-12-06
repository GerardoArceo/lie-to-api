import sys  #Para leer entradas de terminal
import os
import json
import random

nombres = sys.argv    #Lista de datos que entran por consola al ejecutar el programa
nom_datos = nombres[1]  #Nombre del archivo de datos
nom_output = nombres[2] #Nombre del archivo de output

data = {
    'result': True,
    'hit_probability': random.randint(0, 100)	
}

with open(nom_output, 'w') as outfile:
    json.dump(data, outfile)