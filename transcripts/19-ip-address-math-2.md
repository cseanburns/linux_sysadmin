# Some basic IP subnetting

## Private IP Ranges

Remember, when subnetting, we primarily will work with private IP ranges:

| Start Address | End Address     |
|---------------|-----------------|
| 10.0.0.0      | 10.255.255.255  |
| 172.16.0.0    | 172.31.255.255  |
| 192.168.0.0   | 192.168.255.255 |

## Bigger Subnets

### 10.0.5.23/16

| base-2 | Output |
|--------|--------|
| 2^0    | 1      |
| 2^1    | 2      |
| 2^2    | 4      |
| 2^3    | 8      |
| 2^4    | 16     |
| 2^5    | 32     |
| 2^6    | 64     |
| 2^7    | 128    |


```
10.0.5.23/16

00001010.00000000.00000101.00010111 IP Address: 10.0.5.23
11111111.11111111.00000000.00000000 Mask:       255.255.0.0
-----------------------------------------------------------
00001010.00000000.00000000.00000000 Network ID: 10.0.0.0
```

| Type         | IP            |
|--------------|---------------|
| IP Address   | 10.0.5.23     |
| Netmask/Mask | 255.255.0.0   |
| Network ID   | 10.0.0.0      |
| Start Range  | 10.0.0.1      |
| End Range    | 10.0.255.254  |
| Broadcast    | 10.0.255.255  |

Hosts:

| IPs          |         |
|--------------|---------|
| 10.0.0.1     |         |
| 10.0.0.255   | = 256   |
| 10.0.1.1     |         |
| 10.0.255.255 | = 256   |

- Number of Hosts = 256 x 256 = 65536
- Subtract Network ID (1) and Broadcast (1) = 2 IP addresses
- Number of Usable Hosts = 256 x 256 - 2 = 65534



