from rest_framework import serializers
from ..models import Movie, Genre, Director, Actor, Image


##
##  Serializers pour -genres -acteurs -directeurs -images
##

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'genre', 'created_at'] 


class DirectorSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()  # on utilise la methode defini dans le modèle
    
    class Meta:
        model = Director
        fields = ['id', 'firstname', 'lastname', 'full_name', 'created_at']


class ActorSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()  # on utilise la methode defini dans le modèle
    
    class Meta:
        model = Actor
        fields = ['id', 'firstname', 'lastname', 'full_name', 'created_at']


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'name', 'url', 'is_main', 'created_at'] 


# serializer pour les films (page Film avec les détails dans mon front)
class MovieSerializer(serializers.ModelSerializer):
    # on ajoute les relations
    genres = GenreSerializer(many=True, read_only=True) 
    directors = DirectorSerializer(many=True, read_only=True)
    actors = ActorSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, read_only=True)
   
    average_rating = serializers.ReadOnlyField() # on utilise la methode moyenne_rating du modèle Movie
    
    class Meta:
        model = Movie
        fields = [
            'id_film', 'title', 'description', 'release_date', 'duration',
            'url_trailer', 'images', 'genres', 'directors', 'actors',
            'average_rating', 'created_at', 'updated_at'
        ]

# serializer pour la liste des films (Page Home dans mon front)
class MovieListSerializer(serializers.ModelSerializer):

    # methode pour recup l'image principale
    def get_main_image(self, obj):
        main_image = obj.images.filter(is_main=True).first()
        if main_image:
            return ImageSerializer(main_image).data
        return None
    
    main_image = serializers.SerializerMethodField() # on utilise la methode get_main_image defini au dessus
    # on utilise la methode moyenne_rating du modèle Movie
    average_rating = serializers.ReadOnlyField()
    

    class Meta:
        model = Movie
        fields = ['id_film', 'title', 'release_date', 'main_image', 'average_rating']