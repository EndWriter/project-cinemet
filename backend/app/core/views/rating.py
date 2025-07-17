from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Avg
from ..models import Rating, Movie
from ..serializers import RatingSerializer


# Noter un film ou modifier une note existante
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_movie_view(request):
    movie_id = request.data.get('movie_id')
    movie = get_object_or_404(Movie, id_film=movie_id)
    rating_value = request.data.get('rating')
    
    if not rating_value or not (0 <= int(rating_value) <= 10):
        return Response({
            'error': 'La note doit être comprise entre 0 et 10'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Créer ou mettre à jour la note
    rating, created = Rating.objects.update_or_create(
        user=request.user,
        movie=movie,
        defaults={'rating': rating_value}
    )
    
    # Recalculer la moyenne du film
    average = Rating.objects.filter(movie=movie).aggregate(Avg('rating'))['rating__avg']
    movie.average_rating = round(average, 2) if average else 0
    movie.save()
    
    action = 'ajoutée' if created else 'mise à jour'
    return Response({
        'message': f'Note {action} avec succès',
        'rating': RatingSerializer(rating).data,
        'movie_average': movie.average_rating
    }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


# Récupérer la note d'un utilisateur pour un film
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_rating_view(request):
    movie_id = request.GET.get('movie_id')    
    movie = get_object_or_404(Movie, id_film=movie_id)
    
    try:
        rating = Rating.objects.get(user=request.user, movie=movie)
        return Response(RatingSerializer(rating).data)
    except Rating.DoesNotExist:
        return Response({
            'message': 'Aucune note trouvée pour ce film'
        }, status=status.HTTP_404_NOT_FOUND)


# Supprimer la note d'un utilisateur pour un film
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_rating_view(request):
    movie_id = request.data.get('movie_id')
    movie = get_object_or_404(Movie, id_film=movie_id)
    
    try:
        rating = Rating.objects.get(user=request.user, movie=movie)
        rating.delete()
        
        # Recalculer la moyenne du film
        average = Rating.objects.filter(movie=movie).aggregate(Avg('rating'))['rating__avg']
        movie.average_rating = round(average, 2) if average else 0
        movie.save()
        
        return Response({
            'message': 'Note supprimée avec succès',
            'movie_average': movie.average_rating
        })
    except Rating.DoesNotExist:
        return Response({
            'error': 'Aucune note trouvée pour ce film'
        }, status=status.HTTP_404_NOT_FOUND)


# Récupérer toutes les notes d'un film avec statistiques
@api_view(['GET'])
def get_movie_ratings_view(request, movie_id):
    movie = get_object_or_404(Movie, id_film=movie_id)
    ratings = Rating.objects.filter(movie=movie)
    
    # Statistiques
    total_ratings = ratings.count()
    average = ratings.aggregate(Avg('rating'))['rating__avg']
    average_rating = round(average, 2) if average else 0
    
    # Distribution des notes
    distribution = {}
    for i in range(0, 11):
        distribution[f'{i}_points'] = ratings.filter(rating=i).count()
    
    return Response({
        'movie_id': movie_id,
        'total_ratings': total_ratings,
        'average_rating': average_rating,
        'distribution': distribution,
        'ratings': RatingSerializer(ratings, many=True).data
    })


# Liste des notes données par l'utilisateur connecté
class UserRatingsListView(generics.ListAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Rating.objects.filter(user=self.request.user).order_by('-created_at')