#!/usr/bin/env bash

qemu-system-x86_64 \
  -m 2048 \
  -cpu host \
  -smp 2 \
  -hda $HOME/vms/debian.qcow2 \
  -net nic \
  -net user,hostfwd=tcp::2222-:22 \
  -enable-kvm \
  -vga virtio -display sdl,gl=on
