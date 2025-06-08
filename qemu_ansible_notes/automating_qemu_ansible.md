# Automating with QEMU and Ansible

## QEMU

1. Install QEMU:

    ```
    sudo apt install qemu-system-x86
    ```

2. Download recent version of Debian:

    ```
    wget https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-12.11.0-amd64-netinst.iso -O debian.iso
    ```

3. Create a 10GB virtual disk:

    ```
    qemu-img create -f qcow2 debian.qcow2 10G
    ```

4. Boot the installer:
    - 2048MB of RAM
    - 2 CPUs
    - SSH: forwards host port 222 to guest port 22

    ```
    qemu-system-x86_64 \
      -m 2048 \
      -smp 2 \
      -boot d \
      -cdrom debian.iso \
      -hda debian.qcow2 \
      -net nic \
      -net user,hostfwd=tcp::2222-:22 \
      -enable-kvm
    ```

5. Proceed with the graphical installation
    - set hostname (e.g., `lamp-vm`)
    - create root password, user, and user password
    - enable OpenSSH during install
    - Install only the base system (no GUI)

6. Boot without ISO

    ```
    qemu-system-x86_64 \
      -m 2048 \
      -smp 2 \
      -hda debian.qcow2 \
      -net nic \
      -net user,hostfwd=tcp::2222-:22 \
      -enable-kvm
    ```

7. Connect to virtual machine

    ```
    ssh user@localhost -p 2222
    ```

    Replace `user` with the user name created during the Debian install

    Since this is a Debian virtual machine, we need to install `sudo`.
    Replace `user` with your username:

    ```
    su -
    apt update
    apt install sudo
    usermod -aG sudo user
    ```

    Then logout for the group change to take effect:

    ```
    exit
    ```

## Ansible setup

1. Install Ansible

    - Debian/Ubuntu or WSL

    ```
    sudo apt update
    sudo apt install ansible
    ```

    - macOS
 
    ```
    brew install ansible
    ```

2. Verify installation

    ```
    ansible --version
    ```

3. Setup passwordless authentication

    - Debian/Ubuntu or WSL (replace `user` with your username)

    ```
    ssh-copy-id -p 2222 -i .ssh/id_ed25519.pub user@localhost
    ```

    - macOS
 
    ```
    brew install ssh-copy-id
    ssh-copy-id -p 2222 -i .ssh/id_ed25519.pub user@localhost
    ```

4. Create project directory

    ```
    mkdir deb_ansible
    cd deb_ansible
    ```

5. Create a basic inventory file. Name it `inventory`, and add the following, replacing `user` with your username:

    ```
    [localvm]
    localhost ansible_port=2222 ansible_user=user ansible_host=127.0.0.1 ansible_ssh_private_key_file=~/.ssh/id_ed25519
    ```

6. Test the connection

    ```
    ansible -i inventory localvm -m ping
    ```

7. Create a `terminal_apps.yml` file, and add the following:

    ```
    # terminal apps

    - name: Install Terminal Apps
      hosts: localvm
      become: yes
      tasks:
        - name: Install terminal tools
          apt:
            name:
              - w3m
              - ed
              - git
              - tmux
              - rsync
              - datamash
        state: present
        update_cache: yes
    ```

8. Run `ansible-playbook` to install the terminal apps listed in `terminals_apps.yml`:

    ```
    ansible-playbook -i inventory terminal_apps.yml --ask-become-pass
    ```

9. Use passwordless `sudo`

    - Log into the virtual machine:

    ```
    ssh -p 2222 user@localhost
    ```

    - Switch to the root user

    ```
    su -
    ```

    - Edit the sudoers file using `visudo`

    ```
    visudo
    ```

    - Add this at the end of the file, replacing `user` with your username:

    ```
    user ALL=(ALL) NOPASSWD:ALL
    ```

    Do no save and exit if you see any errors!

    - Now we can run commands without entering remote's password:

    ```
    ansible-playbook -i inventory terminal_apps.yml
    ```

