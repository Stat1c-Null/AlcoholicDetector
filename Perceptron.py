import numpy as np
import time as t

class Perceptron(object):
  def __init__(self, input_size, learning_rate=0.01):
    self.weights = np.zeros(input_size + 1)  # +1 for bias weight
    self.learning_rate = learning_rate

  def activation_function(self, x):
    return 1 if x >= 0 else 0

  def predict(self, x):
    weighted_sum = np.dot(x, self.weights[1:]) + self.weights[0] #Return 1 if weighted sum is >= 0 else 0. Use internal bias weight
    return self.activation_function(weighted_sum)

  def train(self, training_inputs, labels, epochs):
    self.weights = np.zeros(len(training_inputs[0]) + 1)  # Initialize weights to zeros, +1 for bias weight
    for iteration in range(epochs):
      error = 0
      for inputs, label in zip(training_inputs, labels):
        prediction = self.predict(inputs)
        error = label - prediction
        self.weights[1:] += self.learning_rate * error * inputs
        print("Updated weights (excluding bias):", self.weights[1:])

        #t.sleep(0.1)

        self.weights[0] += self.learning_rate * error  # Update bias weight
    return self
  
  def evaluate(self, test_inputs, test_labels):
    correct_predictions = 0
    for inputs, label in zip(test_inputs, test_labels):
      print("Evaluating input:", inputs)
      prediction = self.predict(inputs)
      if prediction == label:
        correct_predictions += 1
    accuracy = correct_predictions / len(test_labels)
    return accuracy
  
  #Of all samples predicted as positive, how many were actually positive
  def precision(self, test_inputs, test_labels):
    true_positives = 0
    false_positives = 0
    for inputs, label in zip(test_inputs, test_labels):
      prediction = self.predict(inputs)
      if prediction == 1:
        if label == 1:
          true_positives += 1
        else:
          false_positives += 1

    precision = true_positives / (true_positives + false_positives)
    return precision
  
  #Of all the actual positive samples, hiow many were correctly predicted
  def recall(self, test_inputs, test_labels):
    true_positives = 0
    false_negatives = 0
    for inputs, label in zip(test_inputs, test_labels):
      prediction = self.predict(inputs)
      if label == 1:
        if prediction == 1:
          true_positives += 1
        else:
          false_negatives += 1

    recall = true_positives / (true_positives + false_negatives)
    return recall
  
  #Harmonic mean of precision and recall. Gives single score that balances both metrics.
  def f1_score(self, precision, recall):
    f1_score = 2 * (precision * recall) / (precision + recall)
    return f1_score
  
  #Shows how well perceptron performs across different decisions
  def ROC(self, test_inputs, test_labels):
    true_negatives = 0
    false_positives = 0
    for inputs, label in zip(test_inputs, test_labels):
      prediction = self.predict(inputs)
      if label == 0:
        if prediction == 0:
          true_negatives += 1
      if label == 0:
        if prediction == 1:
          false_positives += 1

    true_positive_rate = self.recall(test_inputs, test_labels) #Y-Axis
    false_positive_rate = false_positives / (false_positives + true_negatives) #X-Axis

    AUC = (1 + true_positive_rate - false_positive_rate) / 2
    return AUC

  def check_alcoholic(self, input_data):
    prediction = self.predict(input_data)
    if prediction == 1:
      print("The person is predicted to be Alcoholic.")
    else:
      print("The person is predicted to be Non-Alcoholic.")