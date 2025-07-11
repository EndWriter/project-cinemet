from django.db import models
from .user import User
from .movie import Movie

# modèle FAVORI
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'favorites'
        unique_together = ['user', 'movie']
        verbose_name = 'Favori'
    
    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"