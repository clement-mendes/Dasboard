#!/bin/bash
sed -i 's/utf8mb4_0900_ai_ci/utf8_general_ci/g' Adopte1Api.sql
sed -i 's/CHARSET=utf8mb4/CHARSET=utf8/g' Adopte1Api.sql
sed -i 's/utf8mb4/utf8/g' Adopte1Api.sql

