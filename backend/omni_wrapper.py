import sys
import io
from inference import OmniInference

def process_audio(audio_path):
    omni = OmniInference(ckpt_dir='./checkpoint', device='cuda:0')
    omni.warm_up()

    for audio_chunk in omni.run_AT_batch_stream(audio_path):
        sys.stdout.buffer.write(audio_chunk)
        sys.stdout.buffer.flush()

    # Write the text response to stderr (Rails will capture this)
    text_response = omni.text_tokenizer.decode(torch.tensor(omni.model.last_token_list[-1]))
    sys.stderr.write(text_response)

if __name__ == "__main__":
    audio_path = sys.argv[1]
    process_audio(audio_path)
