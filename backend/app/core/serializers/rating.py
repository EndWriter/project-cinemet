from rest_framework import serializers
from ..models import Rating
from django.core.validators import MinValueValidator, MaxValueValidator


# serializer pour les notes
class RatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    movie = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Rating
        fields = ['id', 'user', 'movie', 'rating', 'created_at']


# serializer pour la création d'une note
class RatingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['movie', 'rating']
