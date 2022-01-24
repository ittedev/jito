# [Choice] Debian OS version: bullseye, buster
ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

RUN curl -Lo "/tmp/deno.zip" "https://github.com/denoland/deno/releases/download/v1.17.3/deno-x86_64-unknown-linux-gnu.zip" \
    && unzip -d /usr/local/bin /tmp/deno.zip

ENV PATH /home/vscode/.deno/bin:/usr/local/bin:$PATH

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends webfs
    # webfsd -F -p 4050

RUN sudo -u vscode deno install -f --allow-read --allow-write --allow-env --allow-run --allow-net https://deno.land/x/beako/cli/beako.ts