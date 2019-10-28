#!/bin/bash
git pull
echo "Copy /next"
scp -r nick@dev.qwiket.com:/home/nick/q2020/sites/qwiket/.next/* /var/www/q2020/sites/qwiket/.next
pm2 restart qwiket-2020