#!/bin/bash
#
#  prune_dir - prune directory by deleting files if we are low on space
#
DIR=$1
CAPACITY_LIMIT=$2

if [ "$DIR" == "" ]
then
    echo "ERROR: directory not specified"
    exit 1
fi

if ! cd $DIR
then
    echo "ERROR: unable to chdir to directory '$DIR'"
    exit 2
fi

if [ "$CAPACITY_LIMIT" == "" ]
then
    CAPACITY_LIMIT=80   # default limit
fi

CAPACITY=$(df -k . | awk '{gsub("%",""); capacity=$5}; END {print capacity}')

if [ $CAPACITY -gt $CAPACITY_LIMIT ]
then
    #
    # Get list of files, oldest first.
    # Delete the oldest files until
    # we are below the limit. Just
    # delete regular files, ignore directories.
    #
    ls -rt | while read FILE
    do
        if [ -f $FILE ]
        then
            if rm -f $FILE
            then
                echo "Deleted $FILE"

                CAPACITY=$(df -k . | awk '{gsub("%",""); capacity=$5}; END {print capacity}')

                if [ $CAPACITY -le $CAPACITY_LIMIT ]
                then
                    # we're below the limit, so stop deleting
                    exit
                fi
            fi
        fi
    done
fi
