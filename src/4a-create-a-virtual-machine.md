# Create a Virtual Machine

The next step is to create and launch your own virtual machine.
We can use several hosting solutions for this, but for our purposes, we will use [DigitalOcean][digital_ocean].

Note that you will need a debit or credit card for this, and that this will incur a cost.
The cost should be around $4.00 or less per month, but you will want to monitor your costs on the DigitalOcean website.

## Part 1: Start creating your Droplet

1. Visit the [DigitalOcean][digital_ocean] website.
2. Sign up or log in. You can create or log in with your Google account. Other account options are available, too.

Once you are logged in, you can create what DigitalOcean calls a **Droplet**.
This is their term for a virtual machine.
On the main page, you will see a **Quick Actions** section.
In this section, click on **Create a Droplet**.
This will take you to the **Create Droplet** page where you will pick the options for your Droplet:

1. **Choose a datacenter region**
    - Select the default option or choose a location closer to you under the **Additional datacenter regions** dropdown menu.
2. **Choose an image**
    - This is where you select your Linux distribution for your Droplet.
    - Choose the default option, which should be **Ubuntu (Recommended) 24.04 (LTS) x64**
3. **Choose a Droplet Plan**
    - Select **Regular Disk Type: SSD**
    - Select **$4.00/mo 1vCPU - 512 MB RAM - 10GB SSD - 500GB Transfer**

The next step is to create and add an SSH key.
The steps depend on which operating system you are using.

## Part 2: Create an SSH key on your computer

### SSH Key on Windows

#### Step 1: Open Powershell

1. Press the **Windows Key** on your keyboard.
2. Type `powershell`
3. Click on **Windows Powershell** to open it.

#### Step 2: Run the Generation Command

1. Run the following command:

    ```
    ssh-keygen -t ed25519 -C "ICT418 Droplet"
    ```

    - **NOTE:** if you receive a terminal message that your SSH key already exists, **do not overwrite it**. Instead, skip to **Step 5** below.

#### Step 3: Follow the Prompts

1. **Save Location:** The terminal will prompt you to choose where to save the key:

    ```
    Enter file in which to save the key (`C:\Users\YourName/.ssh/id_ed25519`):
    ```

    - Press **Enter** to accept the default location.

2. **Passphrase:** Just press **Enter** twice to leave this blank (i.e., do not create a passphrase). In other circumstances, protecting an SSH private key with a passphrase is recommended. But for now, we can leave this passwordless.

    ```
    Enter passphrase (empty for no passphrase):
    ```


#### Step 4: Locate Your Keys

Once completed, the terminal will display a "randomart" confirmation image.
Your keys will be stored in your profile folder.

- **Default Directory:** `C:\Users\YourName\.ssh\`
- `id_ed25519`: This is your **private key**. Keep this secret and secure on your machine.
- `id_ed25519.pub`: This is your **public key**. You will upload this to your DigitalOcean Droplet.

#### Step 5: Copy your Public Key

To copy your public key to your clipboard, use the following command in your terminal:

```
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

### SSH Key on macOS

#### Step 1: Open a Terminal

1. Open the **Terminal** application. You can use Spotlight (`Command-Space`) to search for `terminal`.
2. Click on **Terminal** to open.

#### Step 2: Run the Generation Command

1. Run the following command:

    ```
    ssh-keygen -t ed25519 -C "ICT418 Droplet"
    ```

    - **NOTE:** if you receive a terminal message that your SSH key already exists, **do not overwrite it**. Instead, skip to **Step 5** below.

#### Step 3: Follow the Prompts

1. **Save Location:** The terminal will prompt you to choose where to save the key:

    ```
    Enter file in which to save the key (`~/.ssh/id_ed25519`)
    ```

    - Press **Enter** to accept the default location.

2. **Passphrase:** Just press **Enter** twice to leave this blank (i.e., do not create a passphrase). In other circumstances, protecting an SSH private key with a passphrase is recommended. But for now, we can leave this passwordless.

    ```
    Enter passphrase (empty for no passphrase):
    ```

#### Step 4: Locate Your Keys

Once completed, the terminal will display a "randomart" confirmation image.
Your keys will be stored in your profile folder.

- **Default Directory:** Accept as suggested (`~/.ssh/`)
- `~/.ssh/id_ed25519`: This is your **private key**. Keep this secret and secure on your machine.
- `~/.ssh/id_ed25519.pub`: This is your **public key**. You will upload this to your DigitalOcean Droplet.

#### Step 5: Copy your Public Key

To copy your public key to your clipboard, use the following command in your terminal.

```
pbcopy < ~/.ssh/id_ed25519.pub
```

## Part 3: Finish creating and connect to your Droplet

1. Click on **Add SSH Key**.
2. Paste your **public key** into the box labeled **SSH Key content**
3. **Give your SSH Key a name**: enter "laptop" or similar to identify the machine the key was created on and that you will use to connect to your Droplet.
4. **Give your Droplet a name**: Feel free to leave this as the default or update it with something more personal, if you would like.
5. Skip to **Finalize** section and select a **project** for your Droplet.
6. Click on **Create Droplet** to have DigitalOcean create your new virtual machine (aka, Droplet).

Once your Droplet has been created, then:

7. Locate the Droplet's public IP address on the DigitalOcean page.
8. Open PowerShell or Terminal and enter:

    ```
    ssh root@your_IP_address
    ```

    You will see a message asking to confirm the authenticity of your host:

    ```
    Are you sure you want to continue connecting (yes/no/[fingerprint])?
    ```

    For this newly created Droplet, type:
    
    ```
    yes
    ```

9. Once you are connected, your command prompt will change. You should now be logged in to your Droplet as the `root` user. Congratulations! You have created your own virtual machine and connected to it remotely! To see that you are logged in as the `root` user, type:

    ```
    whoami
    ```

    You should see:

    ```
    root
    ```

You are now working on a remote computer (a virtual machine / Droplet).

```
your computer / laptop → SSH → another computer (Droplet) → root shell
```

[digital_ocean]:https://www.digitalocean.com/
