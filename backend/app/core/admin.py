from django.contrib import admin
from .models import Movie, Genre, User, Role, Director, Actor, Image, Rating, Favorite, Watchlist

admin.site.register(Movie)
admin.site.register(Genre) 
admin.site.register(User)
admin.site.register(Role)
admin.site.register(Director)
admin.site.register(Actor)
admin.site.register(Image)
admin.site.register(Rating)
admin.site.register(Favorite)
admin.site.register(Watchlist)