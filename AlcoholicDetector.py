#Alcoholic Perceptron: 
# Data points:

# number of drinks consumed when drinking, 
# number of times drunk per month, 
# average amount of alcohol in a drink, 
# number of times thinked about alcohol per day,
# duration of drinking sessions in hours
# Morning drinking frequency (times per week)
# Labels: 1 (Alcoholic), 0 (Non-Alcoholic)

import pandas as pd
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.utils import shuffle
import numpy as np
import Perceptron as p
import time as t

df = pd.read_csv('alcoholic_data.csv')
df = shuffle(df)

print(df.head())

# Separate data and labels
x = df.drop('Label', axis=1).values
y = df['Label'].apply(lambda label: 1 if label == 'alcoholic' else 0).values

print(x)
print(y)

alcNum = 0
for i in y:
  if i == 1:
    alcNum += 1
alcPercent = (alcNum / len(y)) * 100
print(f"Alcoholic percentage in dataset: {alcPercent:.2f}%")
print(f"Number of alcoholic samples: {alcNum} out of {len(y)} total samples.")

# Split the dataset into training and testing sets
#Stratify ensures that both training and testing sets have the same proportion of classes as the original dataset
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, train_size=0.7, random_state=None, shuffle=True, stratify=y) #Stratifed to maintain class distribution

labels_number = x.shape[1]

perceptron = p.Perceptron(input_size=labels_number, learning_rate=0.02)

start = input("Press Enter to start training the Perceptron model...")
start_training = t.time()
perceptron.train(x_train, y_train, epochs=100)
end_training = t.time()
print(f"Training time: {end_training - start_training:.2f} seconds")

#Accuracy
accuracy = perceptron.evaluate(x_test, y_test)
print(f"Model accuracy on test set: {accuracy * 100:.2f}%")

#Precision
precision = perceptron.precision(x_test, y_test)
print(f"Model precision on test set: {precision * 100:.2f}%")

#Recall
recall = perceptron.recall(x_test, y_test)
print(f"Model recall on test set: {recall * 100:.2f}%")

#F1 score
score = perceptron.f1_score(precision, recall)
print(f"Model F1 score on test set: {score * 100:.2f}%")

#Receiver Operating Characteristic (ROC) Curve and AUC
roc_auc = perceptron.ROC(x_test, y_test)
print(f"Model ROC AUC on test set: {roc_auc:.2f}")

analyze = input("Do you want to analyze your drinking habits? (yes/no): ").strip().lower()
while analyze == "yes":
  drinksConsumed = int(input("How many drinks do you consume when drinking? "))
  drunkMonth = int(input("How many times do you get drunk per month? "))
  abv = float(input("What is the average amount of alcohol (ABV) in a drink? Ranges from (0.05 - 0.50) "))
  alcThoughts = int(input("How many times do you think about alcohol per week? "))
  drinkingDuration = int(input("What is the duration of your drinking sessions in hours? "))
  morningDrinking = int(input("How many times do you drink in the morning per month? "))
  user_input = np.array([drinksConsumed, drunkMonth, abv, alcThoughts, drinkingDuration, morningDrinking])
  perceptron.check_alcoholic(user_input)
  analyze = input("Do you want to analyze another drinking habit? (yes/no): ").strip().lower()