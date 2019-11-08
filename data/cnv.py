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

                qNumber = ids[:-1]
                data[qNumber] = []
                continue

        if toggle == False:
            ids += letter

        if toggle == True:
            question += letter

    qMark = ids[-1:]
    print(qMark)
    data[qNumber].append(question)

    print(ids + " | " + question)

    toggle = False
    ids = ""
    question = ""


json_data = json.dumps(data)

f = open("test.json", "w")
f.write(json_data)
f.close()
