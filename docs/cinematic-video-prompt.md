# Perfect-Fit Cinematic Video Generation Guide (GTA VI Scroll Style)

To achieve the ultimate smooth cinematic scroll storytelling where your avatar transitions seamlessly behind the content sheets (just like the **GTA VI / Rockstar Games website**), you can generate a **single high-fidelity 16:9 video** and utilize it directly as a dynamic background layer, or extract key loops from it.

Because your portfolio features a highly polished **alternating grid layout** (text on the left, then text on the right) to keep the design dynamic and readable, the avatar's screen placement must align **exactly** with the layout to avoid hiding any text or panels.

---

## 1. The Layout Architecture Map
Here is how your content is distributed across the screen:
* **Hero Section:** Text & CTA on the **Left** $\rightarrow$ Avatar must be on the **Right**
* **About Section:** Bio & Stats on the **Left** $\rightarrow$ Avatar must be on the **Right**
* **Skills Section:** Tech cards grid on the **Right** $\rightarrow$ Avatar must be on the **Left**
* **Projects Section:** Work cards grid on the **Left** $\rightarrow$ Avatar must be on the **Right**
* **Experience Section:** Timeline cards on the **Right** $\rightarrow$ Avatar must be on the **Left**
* **Drive Section:** Google Drive portal **Centered** $\rightarrow$ Avatar must be **Centered and highly blurred / in the deep background**
* **Contact Section:** Form & Details on the **Left** $\rightarrow$ Avatar must be on the **Right**

---

## 2. Highly Engineered Video Prompt (Runway Gen-3 / Sora)

Use your **uploaded facial reference photos** as the Character Reference input (or Image-to-Video start frame). Run this exact prompt:

### 🌟 16:9 Master Video Prompt
> **Prompt:** A professional 16:9 cinematic website background video with seamless, slow camera panning transitions. The video features one consistent character throughout: a 28-year-old Indian male with thick, dark black hair styled in a modern high-volume swept-up quiff, wearing clean transparent clear-frame rectangular spectacles, a neatly groomed short stubble beard and mustache, and a sharp jawline.
>
> * **Phase 1 (0:00 - 0:03) - Hero:** The character is positioned on the **far right side** of the frame, looking forward confidently with warm neon orange rim lighting on his shoulders. The left side is deep, clean, dark negative space with ambient purple twilight gradients.
> * **Phase 2 (0:03 - 0:06) - About:** The camera slowly slides to the left. The character remains on the **right side**, shifting to a focused profile pose, looking slightly away into a dark room with floating purple developer terminals. Left side is dark and empty.
> * **Phase 3 (0:06 - 0:09) - Skills:** Seamless camera pan to the right. The character is now positioned on the **far left side** of the frame, looking towards the right with cyan edge highlights. The right side is a completely empty, dark, glowing holographic grid.
> * **Phase 4 (0:09 - 0:12) - Projects:** Camera slides to the left. The character is on the **far right side** of the frame, looking at futuristic control-room dashboard panels. The left side is clean dark space with subtle blue gridlines.
> * **Phase 5 (0:12 - 0:15) - Experience:** Camera slides to the right. The character is on the **far left side**, dressed in a premium dark executive coat, looking professional and experienced. The right side is deep dark corporate charcoal space.
> * **Phase 6 (0:15 - 0:18) - Drive:** The character moves to the **deep background, heavily blurred and subdued** behind green security encrypt firewalls. The foreground center is clean, dark, and empty.
> * **Phase 7 (0:18 - 0:21) - Contact:** Camera pans to the right. The character is on the **far right side**, smiling warmly and welcoming the viewer near a warm amber twilight sunset desk. The left side has a clean golden-orange gradient glow.
> 
> * **Cinematography & Style:** Ultra-realistic 3D render style, 8k, photorealistic, premium volumetric twilight lighting, dark cyberpunk-inspired professional aesthetic, high-contrast. Absolutely no text, no logos, no watermarks, no extra people, no broken anatomy. Ensure perfect, steady facial identity matching the reference images in every single phase. Each phase maintains a distinct side of the screen 100% empty for clean website overlay content.

---

## 3. High-Performance Web Integration Options

Once your video is generated, you have two elite ways to integrate it:

### Option A: Direct HTML5 Background Video (Recommended for Infinite Smoothness)
Save the video as `/public/assets/avatar_cinematic.mp4` and let it loop in the background. We can update `/src/components/AvatarLayer.tsx` to scrub or play specific timestamps of the video using GSAP ScrollTrigger based on scroll position!

### Option B: High-Performance WebP Frame Loop (Recommended for Mobile Speed)
Extract key frame files from the video at each segment:
1. `hero_bg.webp` (extracted from 0:01)
2. `about_bg.webp` (extracted from 0:04)
3. `skills_bg.webp` (extracted from 0:07)
4. `projects_bg.webp` (extracted from 0:10)
5. `experience_bg.webp` (extracted from 0:13)
6. `drive_bg.webp` (extracted from 0:16)
7. `contact_bg.webp` (extracted from 0:19)

Your website is **already fully pre-engineered** to read these WebP frames with high-performance 2.5D parallax drift and smooth GSAP crossfades! Saving these files in `/public/assets/` will activate them instantly.
