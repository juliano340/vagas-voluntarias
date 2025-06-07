$env:PGPASSWORD = "root"
$data = Get-Date -Format "yyyy-MM-dd"
$arquivo = "D:\Backups\backup_$data.backup"


& "D:\Apps\Postgres\bin\pg_dump.exe" `
  -U postgres `
  -h localhost `
  -p 5432 `
  -F c `
  -b `
  -v `
  -f $arquivo `
  vagas