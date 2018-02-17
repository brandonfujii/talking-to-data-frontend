#!/bin/bash

platform="$(uname -s)"
case "${platform}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine=platform;;
esac

if [ $machine = "Linux" ] || [ $machine = "Mac" ];
then
  echo "Running on a linux machine"
  export NODE_SRC="src/"
  react-scripts start
elif [ $machine = "Cygwin" ] || [ $machine = "MinGw" ];
then
  echo "Running on a win machine"
  set NODE_SRC="src/"
  react-scripts start
else
  echo "Machine running on platform. Terminating..."
fi