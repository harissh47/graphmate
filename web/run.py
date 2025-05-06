# Simple program to print right-sided pattern
# Number of rows we want
rows = 3

# Loop for each row
for row in range(rows):
    # First print the spaces
    spaces = rows - row - 1
    print(" " * spaces, end="")
    
    # Then print the stars
    stars = row + 1
    print("*" * stars)
