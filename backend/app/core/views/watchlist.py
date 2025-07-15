from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Watchlist, Movie
from ..serializers import WatchlistSerializer


# Liste de la watchlist de l'utilisateur connecté
class WatchlistListView(generics.ListAPIView):
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)


# Ajouter/retirer un film de la watchlist
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_watchlist_view(request, movie_id):
    movie = get_object_or_404(Movie, id_film=movie_id)
    
    if request.method == 'POST':
        # Ajouter à la watchlist
        watchlist_item, created = Watchlist.objects.get_or_create(
            user=request.user,
            movie=movie
        )
        if created:
            return Response({
                'message': 'Film ajouté à la watchlist',
                'watchlist': WatchlistSerializer(watchlist_item).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'message': 'Film déjà dans la watchlist'
            }, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        # Retirer de la watchlist
        try:
            watchlist_item = Watchlist.objects.get(user=request.user, movie=movie)
            watchlist_item.delete()
            return Response({
                'message': 'Film retiré de la watchlist'
            }, status=status.HTTP_200_OK)
        except Watchlist.DoesNotExist:
            return Response({
                'error': 'Film non trouvé dans la watchlist'
            }, status=status.HTTP_404_NOT_FOUND)


# Vérifier si un film est dans la watchlist
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_watchlist_view(request, movie_id):
    movie = get_object_or_404(Movie, id_film=movie_id)
    is_in_watchlist = Watchlist.objects.filter(user=request.user, movie=movie).exists()
    
    return Response({
        'is_in_watchlist': is_in_watchlist
    })