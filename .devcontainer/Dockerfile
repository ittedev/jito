# [Choice] Debian OS version: bullseye, buster
ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

RUN curl -Lo "/tmp/deno.zip" "https://github.com/denoland/deno/releases/download/v1.24.0/deno-x86_64-unknown-linux-gnu.zip" \
    && unzip -d /usr/local/bin /tmp/deno.zip

ENV PATH /home/vscode/.deno/bin:/usr/local/bin:$PATH

RUN apt update && export DEBIAN_FRONTEND=noninteractive
RUN apt -y install --no-install-recommends webfs
RUN apt -y install nodejs
RUN apt -y install npm
RUN npm install n -g
RUN n stable
