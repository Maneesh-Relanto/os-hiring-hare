# Quick PostgreSQL Password Reset Guide

## Step 1: Edit pg_hba.conf

1. **Open this file in Notepad as Administrator:**
   ```
   C:\Program Files\PostgreSQL\17\data\pg_hba.conf
   ```

2. **Find these lines near the bottom (around line 80-90):**
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            scram-sha-256
   # IPv6 local connections:
   host    all             all             ::1/128                 scram-sha-256
   ```

3. **Change `scram-sha-256` to `trust`:**
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            trust
   # IPv6 local connections:
   host    all             all             ::1/128                 trust
   ```

4. **Save and close**

## Step 2: Restart PostgreSQL

In your Administrator cmd:
```cmd
net stop postgresql-x64-17
net start postgresql-x64-17
```

## Step 3: Connect and Reset Password

```cmd
cd "C:\Program Files\PostgreSQL\17\bin"
psql -U postgres
```

You should now be logged in! Then run:
```sql
ALTER USER postgres WITH PASSWORD 'YourNewPassword123!';
\q
```

## Step 4: Restore Security

1. **Open pg_hba.conf again**
2. **Change `trust` back to `scram-sha-256`:**
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   host    all             all             ::1/128                 scram-sha-256
   ```
3. **Save**

## Step 5: Restart PostgreSQL Again

```cmd
net stop postgresql-x64-17
net start postgresql-x64-17
```

## Test Login

```cmd
psql -U postgres
# Enter your new password when prompted
```

Done! Now use this password in pgAdmin.
