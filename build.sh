# BUILD STEPS
# 1. build app
# 2. Move new built app to that directory
# 3. Add build information to a log file
# 4. Add sha1 of the latest commit to the log file

# VARIABLES
BUILDS_DIR=../builds
LOGS_FILE=$BUILDS_DIR/logs.txt
NEW_BUILD_DIR_NAME=$(date +"%d-%m-%y_%H.%M.%S")
NEW_BUILD_DIR=$BUILDS_DIR/$NEW_BUILD_DIR_NAME
LAST_COMMIT=$(git log -1 --pretty=oneline --no-color | sed -E "s/^([^[:space:]]+).*/\1/")

if [ -z "$1" ]; then echo "you need to pass an environment. \`prod\` or \`staging\`"; exit; fi

echo "Building for" $1

echo "Starting process..."
printf "Build information\n"
echo "New build dir: "$NEW_BUILD_DIR
echo "Logs file: "$LOGS_FILE
printf "\n"

export NEW_BUILD_DIR_NAME

printf "Building the app using grunt\n"
# (1)
grunt build:$1

printf "Build complete. Moving to ${BUILDS_DIR}\n"
# (2)
mv dist $NEW_BUILD_DIR

# (3)
echo $NEW_BUILD_DIR_NAME,$LAST_COMMIT >> $LOGS_FILE
