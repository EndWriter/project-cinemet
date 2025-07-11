from rest_framework import serializers
from ..models import Watchlist
from .movie import MovieListSerializer
from .user import UserSerializer

# serializer pour la watchlist
class WatchlistSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    movie = MovieListSerializer(read_only=True)
    
    class Meta:
        model = Watchlist
        fields = ['id', 'user', 'movie', 'created_at']


class WatchlistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watchlist
        fields = ['movie']