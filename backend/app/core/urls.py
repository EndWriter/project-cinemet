from django.urls import path
from .views.user import RegisterView, login_view, logout_view, profile_view, users_list_view, change_password_view
from .views.movie import (
    MovieListView, MovieDetailView, MovieCreateView, MovieUpdateView, MovieDeleteView, admin_movies_view,
    GenreListView, DirectorListView, ActorListView,
    DirectorCreateView, DirectorUpdateView, DirectorDeleteView,
    ActorCreateView, ActorUpdateView, ActorDeleteView
)
from .views.favorite import FavoriteListView, toggle_favorite_view, check_favorite_view
from .views.watchlist import WatchlistListView, toggle_watchlist_view, check_watchlist_view
from .views.rating import (
    rate_movie_view, get_user_rating_view, delete_rating_view, 
    get_movie_ratings_view, UserRatingsListView
)
from .views.contact import send_contact_email, get_contact_info

urlpatterns = [
    # URL User
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', profile_view, name='profile'),
    path('change-password/', change_password_view, name='change-password'),
    path('users/', users_list_view, name='users-list'),  # (admin only)
    
    # URL Movies
    path('movies/', MovieListView.as_view(), name='movies-list'),
    path('movies/<int:id_film>/', MovieDetailView.as_view(), name='movie-detail'),
    
    # URL pour les filtres et listes
    path('genres/', GenreListView.as_view(), name='genres-list'),
    path('directors/', DirectorListView.as_view(), name='directors-list'),
    path('actors/', ActorListView.as_view(), name='actors-list'),
    
    # URL Favoris
    path('favorites/', FavoriteListView.as_view(), name='favorites-list'),
    path('favorites/<int:movie_id>/', toggle_favorite_view, name='toggle-favorite'),
    path('favorites/<int:movie_id>/check/', check_favorite_view, name='check-favorite'),
    
    # URL Watchlist
    path('watchlist/', WatchlistListView.as_view(), name='watchlist-list'),
    path('watchlist/<int:movie_id>/', toggle_watchlist_view, name='toggle-watchlist'),
    path('watchlist/<int:movie_id>/check/', check_watchlist_view, name='check-watchlist'),
    
    # URL Ratings/Notes
    path('ratings/', UserRatingsListView.as_view(), name='user-ratings-list'),
    path('ratings/<int:movie_id>/', rate_movie_view, name='rate-movie'),
    path('ratings/<int:movie_id>/get/', get_user_rating_view, name='get-user-rating'),
    path('ratings/<int:movie_id>/delete/', delete_rating_view, name='delete-rating'),
    path('movies/<int:movie_id>/ratings/', get_movie_ratings_view, name='movie-ratings'),
    
    # URL Contact
    path('contact/', send_contact_email, name='send-contact'),
    path('contact/info/', get_contact_info, name='contact-info'),
    
    # URL Admin CRUD - Movies
    path('admin/movies/', admin_movies_view, name='admin-movies'),
    path('admin/movies/create/', MovieCreateView.as_view(), name='movie-create'),
    path('admin/movies/<int:id_film>/update/', MovieUpdateView.as_view(), name='movie-update'),
    path('admin/movies/<int:id_film>/delete/', MovieDeleteView.as_view(), name='movie-delete'),
    
    # URL Admin CRUD - Directors
    path('admin/directors/create/', DirectorCreateView.as_view(), name='director-create'),
    path('admin/directors/<int:pk>/update/', DirectorUpdateView.as_view(), name='director-update'),
    path('admin/directors/<int:pk>/delete/', DirectorDeleteView.as_view(), name='director-delete'),
    
    # URL Admin CRUD - Actors
    path('admin/actors/create/', ActorCreateView.as_view(), name='actor-create'),
    path('admin/actors/<int:pk>/update/', ActorUpdateView.as_view(), name='actor-update'),
    path('admin/actors/<int:pk>/delete/', ActorDeleteView.as_view(), name='actor-delete'),
]