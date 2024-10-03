# app/controllers/api/calendars_controller.rb
module Api
    class CalendarsController < ApplicationController
      skip_before_action :verify_authenticity_token
  
      def index
        # Fetch calendar events from the database or an external API
        events = CalendarEvent.all
        render json: events
      end
  
      # Add other actions if needed
    end
  end
  