from django.db import models
from .user import User
from .movie import Movie

#modèle WaWatchlist
class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='watchlist')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'watchlists'
        unique_together = ['user', 'movie']
        verbose_name = 'Film à voir'
    
    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"