import argparse

parser = argparse.ArgumentParser()
parser.add_argument("string")
args = parser.parse_args()
string = args.string

def reverseString(userString):
  return userString[::-1]

print(reverseString(string))