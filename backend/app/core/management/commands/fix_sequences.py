from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Corrige les séquences PostgreSQL pour éviter les erreurs de clés primaires'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Obtenir les vraies tables de la base de données
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema='public' 
                AND table_type='BASE TABLE'
                AND (table_name LIKE '%favorite%' 
                   OR table_name LIKE '%watchlist%'
                   OR table_name LIKE '%rating%'
                   OR table_name LIKE '%movie%'
                   OR table_name LIKE '%user%'
                   OR table_name LIKE '%genre%'
                   OR table_name LIKE '%actor%'
                   OR table_name LIKE '%director%')
                ORDER BY table_name;
            """)
            
            tables = [row[0] for row in cursor.fetchall()]
            
            self.stdout.write(f"Tables trouvées : {tables}")
            
            for table in tables:
                try:
                    # Obtenir le nom de la séquence pour la colonne id
                    cursor.execute(f"""
                        SELECT pg_get_serial_sequence('{table}', 'id');
                    """)
                    result = cursor.fetchone()
                    
                    if result and result[0]:
                        sequence_name = result[0]
                        
                        # Obtenir la valeur max actuelle
                        cursor.execute(f"SELECT COALESCE(MAX(id), 0) FROM {table};")
                        max_id = cursor.fetchone()[0]
                        
                        # Réinitialiser la séquence au maximum + 1
                        cursor.execute(f"SELECT setval('{sequence_name}', {max_id + 1});")
                        
                        self.stdout.write(
                            self.style.SUCCESS(f'✅ Séquence corrigée pour {table} -> max_id: {max_id}')
                        )
                    else:
                        self.stdout.write(
                            self.style.WARNING(f'⚠️  Pas de séquence trouvée pour {table}')
                        )
                        
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'❌ Erreur pour {table}: {str(e)}')
                    )
            
            self.stdout.write(
                self.style.SUCCESS('Correction des séquences terminée!')
            )
