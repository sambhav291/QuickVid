// Test script to verify youtubei.js package works
const { Innertube } = require('youtubei.js');

async function testTranscript() {
  try {
    // Test with a known working video (TED Talk with captions)
    const videoId = 'UF8uR6Z6KLc'; // Sample TED Talk
    
    console.log('Testing youtubei.js package...');
    console.log('Video ID:', videoId);
    
    // Initialize Innertube
    const youtube = await Innertube.create();
    console.log('✅ Innertube created');
    
    // Get video info
    const videoInfo = await youtube.getInfo(videoId);
    console.log('✅ Video info fetched');
    console.log('Title:', videoInfo.basic_info.title);
    
    // Get transcript
    const transcriptData = await videoInfo.getTranscript();
    console.log('✅ Transcript data fetched');
    
    if (!transcriptData || !transcriptData.transcript) {
      console.error('❌ No transcript available');
      return;
    }
    
    const transcript = transcriptData.transcript.content.body.initial_segments
      .map(segment => segment.snippet.text)
      .join(' ');
    
    console.log('✅ SUCCESS! Transcript extracted');
    console.log('Length:', transcript.length);
    console.log('Sample:', transcript.substring(0, 200));
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Full error:', error);
  }
}

testTranscript();
