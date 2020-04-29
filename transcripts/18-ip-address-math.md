# Some basic IP subnetting

## Private IP Ranges

Remember, when subnetting, we primarily will work with private IP ranges:

| Start Address | End Address     |
|---------------|-----------------|
| 10.0.0.0      | 10.255.255.255  |
| 172.16.0.0    | 172.31.255.255  |
| 192.168.0.0   | 192.168.255.255 |

## IP Meaning

An IP address is 32 bits (8 x 4), or four bytes, in size. In human readable
context, it's usually expressed in the following notation style:

**192.168.1.6**

Each set of numbers separated by a dot is referred to as an **octet**, and an
**octet** is a group of 8 **bits**. Eight **bits** also equal a single
**byte**.

| Term  | Symbol |
|-------|--------|
| bit   | *b*    |
| byte  | B      |
| octet | *o*    |

Each bit is represented by either a 1 or a 0. E.g., the above address in binary
is:

**11000000.10101000.00000001.00000110**

- 11000000 = 192
- 10101000 = 168
- 00000001 = 1
- 00000110 = 6

## IP Math

When doing IP math, one easy way to do it is to simply remember that each bit
in each of the above bytes is a placeholder for the following values:

**128 64 32 16 8 4 2 1**

Alternatively, from low to high:

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

In binary, 192 is equal to 11000000. It's helpful to work backward. For IP
addresses, all octets are 255 or less (256 total, from 0 to 255) and therefore
do not exceed 8 bits or places:

```
1 * 2^7 = 128
1 * 2^6 =  64 (128 + 64 = 192)
```
STOP: There are no values left, and so the rest are zeroes.

So: 11000000

Our everyday counting system is base-10, but binary is base-2, and so another
way to convert binary to decimal is to multiple each bit by the power of base
two and to the power of its placeholder:

```
(0 * 2^0) +
(0 * 2^1) +
(0 * 2^2) +
(0 * 2^3) +
(0 * 2^4) +
(0 * 2^5) +
(1 * 2^6) +
(1 * 2^7) = 192
```

Another way: to convert to binary, simply subtract the numbers from each value.
As long as there is something remaining or the placeholder equals the remainder
of the previous subtraction, then the bit equals 1. So:

- 192 - 128 = 64 -- therefore the first bit is equal to 1.
- Now take the leftover and subtract it:
- 64 - 64 = 0 -- therefore the second bit is equal to 1.

Since there is nothing remaining, the rest of the bits equal 0.

## Subnetting

Subnetting involves dividing a network into two more more subnets. When we
subnet, we need to first identify the number of hosts we will require on the
subnet. For starters, let's assume that we need a subnet that can assign at
most 254 IP addresses to the devices attached to it via the router. 

We also need two additional IP addresses: the **subnet mask** and the **network
address/ID**. The **network address** identifies the network and the **subnet
mask** marks the boundary between the network and the hosts. Knowing or
determining the **subnet mask** will allow us to determine how many hosts can
exist on a network. Both the **network address** and the **subnet mask** can be
written as IP addresses, but they cannot be assigned to computers on a network.

Finally, when we have these IPs, we will also know the **broadcast address**.
This is the last IP address in a subnet range, and also cannot be assigned to
a connected device. The **broadcast address** is used by a router, for
instance, to communicate to all connected devices, and is comparable to the MAC
address that we learned about in our discussion on the link layer and ARP.

For our sake, let's work backwards, though, and say we want to identify and
describe a network that we are connected to. Let's work with two example
private IP addresses that exist on two separate subnets:

**IP addresses:**

- 192.168.1.6/24:  Some Desktop 1, Subnet A
- 10.160.38.75/24: Some Desktop 1, Subnet B

### 192.168.1.6 : Desktop 1, Subnet A

Let's derive the network mask and the network address (or ID) from this IP
address.

```
11000000.10101000.00000001.00000110 IP              192.168.1.6
11111111.11111111.11111111.00000000 Mask            255.255.255.0
-----------------------------------
11000000.10101000.00000001.00000000 Network Address 192.168.1.0
```

Note the mask has 24 ones followed by 8 zeroes. That 24 is used as CIDR
notation, so:

192.168.1.6/24

### 10.160.38.75 : Desktop 1, Subnet B

```
00001010.10100000.00100110.01001011 IP               10.160.38.75
11111111.11111111.11111111.00000000 Mask            255.255.255.0
-----------------------------------
00001010.10100000.00100110.00000000 Network Address   10.163.38.0
```

For Desktop 1, Subnet A, we have the following:

| Type         | IP            |
|--------------|---------------|
| Netmask/Mask | 255.255.255.0 |
| Network ID   | 192.168.1.0   |
| Start Range  | 192.168.1.1   |
| End Range    | 192.168.1.254 |
| Broadcast    | 192.168.1.255 |

For Desktop 1, Subnet B, we have the following

| Type         | IP            |
|--------------|---------------|
| Netmask/Mask | 255.255.255.0 |
| Network ID   | 10.163.38.0   |
| Start Range  | 10.163.38.1   |
| End Range    | 10.163.38.254 |
| Broadcast    | 10.163.38.255 |

## Final example:

Derive the network information for 172.16.1.62/24:

```
10101100 00010000 00000001 00100111 IP                172.16.1.62
11111111 11111111 11111111 00000000 Mask            255.255.255.0
-----------------------------------
10101100 00010000 00000001 00000000 Network Address    172.16.1.0
```

| Type         | IP            |
|--------------|---------------|
| Netmask/Mask | 255.255.255.0 |
| Network ID   | 172.16.1.0    |
| Start Range  | 172.16.1.1    |
| End Range    | 172.16.1.254  |
| Broadcast    | 172.16.1.255  |
