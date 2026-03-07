# syntax=docker/dockerfile:1
# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory to /app inside the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application source code from the host to the container's /app directory
COPY . .

# Expose the port the app runs on (adjust as needed for your application)
EXPOSE 8000

# Define the command to run the application when the container starts
CMD ["python", "index.py"]
