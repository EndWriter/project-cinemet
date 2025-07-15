from rest_framework import serializers
from ..models import Favorite
from .movie import MovieListSerializer
from .user import UserSerializer


# serializer pour favoris
class FavoriteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    movie = MovieListSerializer(read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'movie', 'created_at']

# serializer pour la création de favoris
class FavoriteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['movie']