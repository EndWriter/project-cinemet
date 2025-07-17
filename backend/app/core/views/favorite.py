from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from ..models import Favorite, Movie
from ..serializers import FavoriteSerializer


# Liste des favoris de l'utilisateur connecté
class FavoriteListView(generics.ListAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)


# Ajouter/retirer un film des favoris
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_favorite_view(request, movie_id):
    movie = get_object_or_404(Movie, id_film=movie_id)
    
    if request.method == 'POST':
        # Ajouter aux favoris
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            movie=movie
        )
        if created:
            return Response({
                'message': 'Film ajouté aux favoris',
                'favorite': FavoriteSerializer(favorite).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'message': 'Film déjà dans les favoris'
            }, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        # Retirer des favoris
        try:
            favorite = Favorite.objects.get(user=request.user, movie=movie)
            favorite.delete()
            return Response({
                'message': 'Film retiré des favoris'
            }, status=status.HTTP_200_OK)
        except Favorite.DoesNotExist:
            return Response({
                'error': 'Film non trouvé dans les favoris'
            }, status=status.HTTP_404_NOT_FOUND)


# Vérifier si un film est dans les favoris
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_favorite_view(request, movie_id):
    movie = get_object_or_404(Movie, id_film=movie_id)
    is_favorite = Favorite.objects.filter(user=request.user, movie=movie).exists()
    
    return Response({
        'is_favorite': is_favorite
    })


# Ajouter un film aux favoris
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_favorite_view(request):
    movie_id = request.data.get('movie_id')
    if not movie_id:
        return Response({
            'error': 'movie_id requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    movie = get_object_or_404(Movie, id_film=movie_id)
    favorite, created = Favorite.objects.get_or_create(
        user=request.user,
        movie=movie
    )
    
    if created:
        return Response({
            'message': 'Film ajouté aux favoris',
            'favorite': FavoriteSerializer(favorite).data
        }, status=status.HTTP_201_CREATED)
    else:
        return Response({
            'message': 'Film déjà dans les favoris'
        }, status=status.HTTP_200_OK)


# Retirer un film des favoris
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_favorite_view(request):
    movie_id = request.data.get('movie_id')
    if not movie_id:
        return Response({
            'error': 'movie_id requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    movie = get_object_or_404(Movie, id_film=movie_id)
    
    try:
        favorite = Favorite.objects.get(user=request.user, movie=movie)
        favorite.delete()
        return Response({
            'message': 'Film retiré des favoris'
        }, status=status.HTTP_200_OK)
    except Favorite.DoesNotExist:
        return Response({
            'error': 'Film non trouvé dans les favoris'
        }, status=status.HTTP_404_NOT_FOUND)


# Toggle favoris (ajouter si pas présent, retirer si présent)
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite_api_view(request):
    movie_id = request.data.get('movie_id')
    if not movie_id:
        return Response({
            'error': 'movie_id requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    movie = get_object_or_404(Movie, id_film=movie_id)
    
    try:
        # Si le film est déjà en favoris, le retirer
        favorite = Favorite.objects.get(user=request.user, movie=movie)
        favorite.delete()
        return Response({
            'message': 'Film retiré des favoris',
            'is_favorite': False
        }, status=status.HTTP_200_OK)
    except Favorite.DoesNotExist:
        # Si le film n'est pas en favoris, l'ajouter
        favorite = Favorite.objects.create(user=request.user, movie=movie)
        return Response({
            'message': 'Film ajouté aux favoris',
            'is_favorite': True,
            'favorite': FavoriteSerializer(favorite).data
        }, status=status.HTTP_201_CREATED)