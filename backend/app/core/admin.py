from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Role, Movie, Genre, Director, Actor, Rating, Favorite, Watchlist

# Configuration User Admin
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'is_active')
    list_filter = ('role', 'is_active', 'created_at')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('info dite personnel', {'fields': ('username', 'first_name', 'last_name')}),
        ('permission', {'fields': ('is_active', 'is_staff', 'is_superuser', 'role')}),
        ('Date', {'fields': ('last_login', 'created_at')}),
    )
    
    readonly_fields = ('created_at',)

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('role', 'created_at')
    search_fields = ('role',)

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_date', 'duration', 'average_rating')
    list_filter = ('release_date', 'genres')
    search_fields = ('title', 'description')
    filter_horizontal = ('genres', 'directors', 'actors')

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('genre', 'created_at')
    search_fields = ('genre',)

@admin.register(Director)
class DirectorAdmin(admin.ModelAdmin):
    list_display = ('firstname', 'lastname', 'created_at')
    search_fields = ('firstname', 'lastname')

@admin.register(Actor)
class ActorAdmin(admin.ModelAdmin):
    list_display = ('firstname', 'lastname', 'created_at')
    search_fields = ('firstname', 'lastname')

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('user', 'movie', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'movie', 'created_at')
    list_filter = ('created_at',)

@admin.register(Watchlist)
class WatchlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'movie', 'created_at')
    list_filter = ('created_at',)