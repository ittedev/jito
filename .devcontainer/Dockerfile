# [Choice] Ubuntu version (use hirsuite or bionic on local arm64/Apple Silicon): hirsute, focal, bionic
ARG VARIANT=focal
FROM mcr.microsoft.com/vscode/devcontainers/base:${VARIANT}

ENV PATH /home/vscode/.deno/bin:/usr/local/bin:$PATH

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends nodejs npm

# [Optional] Uncomment this section to install additional OS packages.
RUN curl -Lo "/tmp/deno.zip" "https://github.com/denoland/deno/releases/latest/download/deno-x86_64-unknown-linux-gnu.zip" \
    && unzip -d /usr/local/bin /tmp/deno.zip
RUN sudo -u vscode deno install --allow-net --allow-read https://deno.land/std@0.106.0/http/file_server.ts
