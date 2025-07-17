from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Movie, Genre, Director, Actor
from ..serializers import (
    MovieSerializer, MovieListSerializer, GenreSerializer,
    DirectorSerializer, ActorSerializer
)

# View pour lister les films avec pagination, recherche, filtrage et tri
class MovieListView(generics.ListAPIView):
    # Liste des films
    queryset = Movie.objects.all()
    serializer_class = MovieListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Lecture publique, écriture authentifiée
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]  # Ajout de filtres
    filterset_fields = ['genres']  # Filtrage par genres
    search_fields = ['title']  # Recherche sur titre
    ordering = ['-created_at']  # Tri par date de création décroissante

# Vue pour afficher le détail d'un film spécifique (Page film détaillée)
class MovieDetailView(generics.RetrieveAPIView):
    # Détails d'un film
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'id_film'  # Recherche par identifiant personnalisé

# Vue pour créer un film (réservée à l'admin)
class MovieCreateView(generics.CreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]  # Authentification requise
    
    def get_queryset(self):
        # Seulement les utilisateurs avec le rôle admin peuvent créer des films
        if self.request.user.role and self.request.user.role.role == 'admin':
            return Movie.objects.all()
        return Movie.objects.none()

# CRUD complet pour les films (admin seulement)
class MovieUpdateView(generics.UpdateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id_film'
    
    def get_queryset(self):
        if self.request.user.role and self.request.user.role.role == 'admin':
            return Movie.objects.all()
        return Movie.objects.none()

class MovieDeleteView(generics.DestroyAPIView):
    queryset = Movie.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id_film'
    
    def get_queryset(self):
        if self.request.user.role and self.request.user.role.role == 'admin':
            return Movie.objects.all()
        return Movie.objects.none()

# Vue pour lister tous les films (gestion admin)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_movies_view(request):
    # Vérifie si l'utilisateur est admin
    if request.user.role and request.user.role.role == 'admin':
        movies = Movie.objects.all()
        return Response(MovieSerializer(movies, many=True).data)
    # Refuse l'accès si l'utilisateur n'est pas admin
    return Response({'error': 'Permission refusée'}, status=403)

# Vues pour Genre, Director, Actor (pour les filtres et l'admin)
class GenreListView(generics.ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class DirectorListView(generics.ListAPIView):
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ActorListView(generics.ListAPIView):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# Vues CRUD pour l'admin
class DirectorCreateView(generics.CreateAPIView):
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role and self.request.user.role.role == 'admin':
            return Director.objects.all()
        return Director.objects.none()

class DirectorUpdateView(generics.UpdateAPIView):
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role and self.request.user.role.role == 'admin':
            return Director.objects.all()
        return Director.objects.none()

class DirectorDeleteView(generics.DestroyAPIView):
    queryset = Director.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role and self.request.user.role.role == 'admin':
            return Director.objects.all()
        return Director.objects.none()

class ActorCreateView(generics.CreateAPIView):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role and self.request.user.role.role == 'admin':
            return Actor.objects.all()
        return Actor.objects.none()

class ActorUpdateView(generics.UpdateAPIView):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role and self.request.user.role.role == 'admin':
            return Actor.objects.all()
        return Actor.objects.none()

class ActorDeleteView(generics.DestroyAPIView):
    queryset = Actor.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role and self.request.user.role.role == 'admin':
            return Actor.objects.all()
        return Actor.objects.none()



