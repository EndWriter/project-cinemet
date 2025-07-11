from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
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

#getteur qui vient nous dire si une note est creer(je pars du principe que le save comprend la maj et la création)
# ou supprimer
@receiver(post_save, sender=Rating)
@receiver(post_delete, sender=Rating)
#maj de la moyenne si signalé par ce nos poucave du dessus
def update_movie_average_rating(sender, instance, **kwargs):
    instance.movie.update_average_rating()
