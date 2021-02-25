#!/bin/sh

KEYWORD=$1
KEYWORD=`node -e "console.log('${KEYWORD}'.replace('株式会社','').trim())"`
echo "Keyword: ${KEYWORD}"

WANTEDLY_URL="https://www.wantedly.com/search?q=${KEYWORD}"
WANTEDLY_URL=`node -e "console.log(encodeURI('${WANTEDLY_URL}'))"`
echo $WANTEDLY_URL
open $WANTEDLY_URL

GREEN_URL="https://www.green-japan.com/search_key/01?keyword=${KEYWORD}"
GREEN_URL=`node -e "console.log(encodeURI('${GREEN_URL}'))"`
echo $GREEN_URL
open $GREEN_URL

PAIZA_URL="https://paiza.jp/career/search/?utf8=✓&c[recruiter_name]=${KEYWORD}&commit=検索"
PAIZA_URL=`node -e "console.log(encodeURI('${PAIZA_URL}'))"`
echo $PAIZA_URL
open $PAIZA_URL
