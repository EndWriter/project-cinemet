from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# le genre de film 
class Genre(models.Model):
    # le nom du genre
    genre = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'genres'
        verbose_name = 'Genre'
    
    def __str__(self):
        return self.genre

# réalisateur (on pense a notre NOLAN le meilleur de tous, je pose ça la)
class Director(models.Model):
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'directors'
        verbose_name = 'Réalisateur'
    
    def __str__(self):
        return f"{self.firstname} {self.lastname}"
    

    @property
    def full_name(self):
        #pour me retouner nom et prénom du real
        return f"{self.firstname} {self.lastname}"

#acteur
class Actor(models.Model):
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'actors'
        verbose_name = 'Acteur'
    
    def __str__(self):
        return f"{self.firstname} {self.lastname}"
    
    @property
    def full_name(self):
        return f"{self.firstname} {self.lastname}"

# FILM
class Movie(models.Model):
    #important pour identifier le film (je pense a la navigation dans le front)
    id_film = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    release_date = models.DateField(null=True, blank=True)
    duration = models.PositiveIntegerField()
    url_trailer = models.URLField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # note(moyenne des notes données par les users)(entre 0 et 10)
    average_rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    
    #
    # Relations Many to Many
    #

    #relations avec genre
    genres = models.ManyToManyField(
        Genre, 
        related_name='movies'
    )
    # relations avec les réalisateurs
    directors = models.ManyToManyField(
        Director, 
        related_name='movies'
    )
    # relations avec les acteurs
    actors = models.ManyToManyField(
        Actor, 
        related_name='movies'
    )
    
    # relations avec les images
    #je declare ma relation ici, pour eviter le conflit entre table
    images = models.ManyToManyField(
        'Image', 
        related_name='movies'
    )
    
    class Meta:
        db_table = 'movies'
        verbose_name = 'Film'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['release_date']),
            models.Index(fields=['average_rating']),
        ]
    
    def __str__(self):
        return self.title

    #calcule la moyenne des notes pour LE film
    def calculate_average_rating(self):
        from .rating import Rating # j'evite les problème de dependance
        ratings = Rating.objects.filter(movie=self)
        if ratings.exists():
            total = sum(rating.rating for rating in ratings)
            return round(total / ratings.count(), 2)
        return 0.00
    
    #met a jour la moyenne des notes du film (fonction appelé dans rating.py, pour re maj si 
    # une note est ajoutée ou supprimée)
    def update_average_rating(self):
        self.average_rating = self.calculate_average_rating()
        self.save(update_fields=['average_rating'])

#POSTER
class Image(models.Model):
    name = models.CharField(max_length=100)
    # chemin vers dossier 'media/'
    url = models.ImageField(upload_to='movies/', max_length=300)
    is_main = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    class Meta:
        db_table = 'images'
        verbose_name = 'Image'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name