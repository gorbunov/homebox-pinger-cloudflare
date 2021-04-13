#!/usr/bin/env bash

# env
GET_STATUS_URL="https://hamachi-keeper.gorbunov.workers.dev/status"
RESTART_CMD="/usr/sbin/service logmein-hamachi restart"
REBOOT_CMD="reboot"

RAW_STATUS_JSON=$(curl --request GET -sL --url "${GET_STATUS_URL}")
NEED_REBOOT=$(echo "${RAW_STATUS_JSON}" | jq '.reboot')
NEED_RESTART=$(echo "${RAW_STATUS_JSON}" | jq '.restart')

echo "restart: ${NEED_RESTART}, reboot: ${NEED_REBOOT}"

if [[ ${NEED_REBOOT} = 'true' ]]
then
  echo "will reboot now";
  $REBOOT_CMD
fi

if [[ ${NEED_RESTART} = 'true' ]]
then
  echo "will restart now";
  $RESTART_CMD
fi
