require 'open3'

module Api
  module V1
    class AppointmentsController < ApplicationController
      def index
        render json: { message: "Appointments API is working" }
      end

      def process_call
        audio_file = params[:audio]
        
        temp_file = Tempfile.new(['audio', '.wav'])
        temp_file.binmode
        temp_file.write(audio_file.read)
        temp_file.close

        response.headers['Content-Type'] = 'audio/wav'
        self.response_body = Enumerator.new do |yielder|
          Open3.popen3("python #{Rails.root.join('omni_wrapper.py')} #{temp_file.path}") do |stdin, stdout, stderr, wait_thr|
            while chunk = stdout.read(1024)
              yielder << chunk
            end
            
            @text_response = stderr.read
          end
        end
      ensure
        temp_file.unlink
      end

      def get_text_response
        render json: { text: @text_response }
      end
    end
  end
end
