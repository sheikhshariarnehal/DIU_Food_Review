-- Allow students to update (edit) their own reviews
CREATE POLICY "Students can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
