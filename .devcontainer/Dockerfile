ARG VARIANT=ubuntu-20.04
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

RUN apt-get update

# fish
RUN apt-get install fish -y

# Deno
RUN apt-get install unzip -y
RUN curl -Lo "/tmp/deno.zip" "https://github.com/denoland/deno/releases/download/v2.0.3/deno-x86_64-unknown-linux-gnu.zip"
RUN unzip -d /usr/local/bin /tmp/deno.zip
ENV PATH /home/vscode/.deno/bin:/usr/local/bin:$PATH

RUN apt-get -y install --no-install-recommends webfs
RUN apt-get -y install nodejs
RUN apt-get -y install npm
RUN npm install n -g
RUN n stable
