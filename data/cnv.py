#script ktory mi previedol povodne data na json

import json
import sys

toggle = False
ids = ""
question = ""

data = {}

for line in sys.stdin:
    for letter in line:
        if toggle == False:
            if letter == "=":
                toggle = True
                continue

        if toggle == False:
            ids += letter

        if toggle == True:
            question += letter

    data[ids].question = question
    #print(ids + " | " + question)

    toggle = False
    ids = ""
    question = ""


json_data = json.dumps(data)

f = open("question.json", "w")
f.write(json_data)
f.close()
        
    