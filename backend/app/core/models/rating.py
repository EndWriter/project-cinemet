from django.db import models
from .user import User
from .movie import Movie

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ratings'
        verbose_name = 'Note'
        unique_together = ('user', 'movie')

    def __str__(self):
        return f"{self.user} - {self.movie}: {self.rating}"
