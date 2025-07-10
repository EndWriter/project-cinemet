from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import EmailValidator


class Role(models.Model):
    #modèle pour les rôles utilisateurs
    role = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    class Meta:
        # définit la table db
        db_table = 'roles'
        verbose_name = 'Rôle'
    
    def __str__(self):
        return self.role


class User(AbstractUser):
    #modèle utilisateur
    id_user = models.AutoField(primary_key=True)

   # jai remplacer pseudo par lee username pour la compatibilité avec AbstractUser
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(
        max_length=100, 
        unique=True,
        validators=[EmailValidator(message="Entrez une adresse email valide")]
    )
    is_active = models.BooleanField(default=True)           # pour django admin
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # clé étrangère vers le table Role
    role = models.ForeignKey(
        Role, 
        on_delete=models.SET_NULL,      # si le rôle est supprimé, l'utilisateur ne le sera pas
        null=True,
        related_name='users' 
    )
    

    # champs requis pour l'authentification
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'Utilisateur'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"

    @property
    def is_admin(self):
        # verifie si l'utilisateur est un admin
        return self.role and self.role.role == 'admin'